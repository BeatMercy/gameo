import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

public class Condition {

    public static void main(String[] args) {
        List<Condition> conds = Arrays.asList(
                getNewCondition(),
                getNewCondition(),
                getNewCondition()
                        .buildOrConditions(
                                getNewCondition(),
                                getNewCondition(),
                                getNewCondition().buildOrConditions(getNewCondition(), getNewCondition()),
                                getNewCondition())
                        .buildConditionField(null).buildConditionKey(null).buildConditionValue(null),
                getNewCondition(),
                getNewCondition());
        System.out.println(Condition.toAndConditionsString(conds));
    }

    public static Condition getNewCondition() {
        String field = "xx";
        String key = "contains";
        String value = "yy";
        return new Condition()
                .buildConditionField(field)
                .buildConditionKey(key)
                .buildConditionValue(value);
    }

    String conditionField;

    String conditionValue;

    String conditionKey;

    List<Condition> orConditions;

    List<Condition> andConditions;

    /**
     * xx contains yy and xx contains yy and ( xx contains yy or xx contains yy or (
     * xx contains yy and ( xx contains yy or xx contains yy) ) or xx contains yy )
     * and xx contains yy
     * 
     * 
     * @param foo
     * @return
     */
    public boolean isMatch(Map<String, String> foo) {
        boolean match = false;
        // and condition caculate
        if (getConditionField() != null && getConditionKey() != null && getConditionValue() != null) {
            if (foo.containsKey(getConditionField())) {
                switch (getConditionKey()) {
                    case "contains":
                    default:
                        match = foo.get(getConditionField()).contains(getConditionValue());
                        break;
                }
            }
        }

        // or conditions caculate
        if (match && null != getOrConditions() && !getOrConditions().isEmpty()) {
            boolean orMatch = false;
            for (Condition or : orConditions) {
                if (or.isMatch(foo)) {
                    orMatch = true;
                    break;
                }
            }
            match = orMatch;
        }

        return match;
    }

    public static boolean isConditionsMatch(List<Condition> conditions, Map<String, String> foo) {
        if (conditions == null) {
            return false;
        }
        for (Condition andCondition : conditions) {
            if (!andCondition.isMatch(foo)) {
                return false;
            }
        }
        return true;
    }

    /**
     * emsname is "asd" and ( alarmname is "Jasdlkj" or (envtype is 'qwe' and emsname is "asd") or alarmname is "ddddd" ) and envname is "asdasd"
     */
    public Condition parseFromWhereTql(String conditionStr) throws RuntimeException {
        if (conditionStr.trim().startsWith("(")) {
            // 去除最外层括号
            conditionStr = conditionStr.trim().substring(1, conditionStr.lastIndexOf(")"));
        }
        // 括号检测
        // and or 链接词
        boolean orConnect = true;
        int andIdx = kmpSearch(conditionStr, " and ");
        int orIdx = kmpSearch(conditionStr, " or ");

        // 无and/or语句
        if (andIdx == -1 && orIdx == -1) {
            return parseToExpression(conditionStr);
        } else if (orIdx == -1 || andIdx < orIdx) {
            // Condition andPart1 = parseFromWhereTql(conditionStr.substring(0, andIdx + 1));
            // Condition andPart2 = parseFromWhereTql(conditionStr.substring(andIdx + 5, conditionStr.length()));

            // 不断寻找下一个or，直到 andIdx !=-1 || andIdx < orIdx || orIdx == -1
            List<Condition> ands = new ArrayList<>();
            int starIdx = 0;
            while (andIdx != -1) {
                Condition andPart = parseFromWhereTql(conditionStr.substring(starIdx, andIdx + 1));
                ands.add(andPart);
                orIdx = kmpSearch(conditionStr.substring(andIdx + 5), " and ");
                starIdx = orIdx + 5;
                if (orIdx != -1 && orIdx < andIdx) {
                    break;
                }
            }

            return new Condition().buildAndConditions(ands);
        } else if (andIdx == -1 || orIdx < andIdx) {
            // 不断寻找下一个or，直到 andIdx !=-1 || andIdx < orIdx || orIdx == -1
            List<Condition> ors = new ArrayList<>();
            int starIdx = 0;
            while (orIdx != -1) {
                Condition orPart = parseFromWhereTql(conditionStr.substring(starIdx, orIdx + 1));
                ors.add(orPart);
                orIdx = kmpSearch(conditionStr.substring(orIdx + 4), " or ");
                starIdx = orIdx + 4;
                if (andIdx != -1 && andIdx < orIdx) {
                    break;
                }
            }

            return new Condition().buildOrConditions(ors);
        }
        return null;
    }

    private Condition parseToExpression(String expressionText) {
        // 单个表达式内部，必须符合 fieldname is/in/contains value 格式，存在多个或者格式不匹配都视为异常
        // [is is not, in, not in, contains, not contains] 条件词判断
        if (expressionText.contains(" is ")) {

        } else if (expressionText.contains(" is not ")) {
        } else if (expressionText.contains(" in ")) {
        } else if (expressionText.contains(" not in ")) {
        } else if (expressionText.contains(" contains ")) {
        } else if (expressionText.contains(" not contains ")) {
        }
        return new Condition()
                .buildConditionField("")
                .buildConditionKey("conditionKey")
                .buildConditionValue("conditionValue");
    }

    // kmp 字符匹配算法
    private int kmpSearch(String srcText, String patText) {
        int[] next = new int[patText.length()];

        int statusIndex = 0;

        for (int i = 1; i < next.length; i++) {
            while (statusIndex > 0 && next[statusIndex] != next[i]) {
                statusIndex = next[statusIndex - 1];
            }
            if (next[statusIndex] == next[i]) {
                statusIndex++;
            }
            next[i] = statusIndex;
        }

        int statusIdx = 0;

        for (int i = 0; i < srcText.length(); i++) {
            while (statusIdx > 0 && srcText.charAt(i) != patText.charAt(statusIdx)) {
                statusIdx = next[statusIdx - 1];
            }
            if (srcText.charAt(i) == patText.charAt(statusIdx)) {
                statusIdx++;
            }

            if (statusIdx == next.length) {
                return i - (statusIdx - 1);
            }
        }
        return -1;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        if (getConditionField() != null && getConditionKey() != null && getConditionValue() != null) {
            sb.append(getConditionField()).append(' ')
                    .append(getConditionKey()).append(' ')
                    .append(getConditionValue()).append(' ');
        }

        if (getOrConditions() != null && !getOrConditions().isEmpty()) {
            if (getConditionField() != null && getConditionKey() != null && getConditionValue() != null) {
                sb.append(' ').append("and").append(' ');
            }
            sb.append('(').append(' ');
            for (int i = 0; i < getOrConditions().size(); i++) {
                Condition or = getOrConditions().get(i);
                sb.append(or.toString()).append(' ');
                if (i + 1 < getOrConditions().size()) {
                    sb.append("or").append(' ');
                } else {
                    sb.append(' ');
                }
            }
            sb.append(')').append(' ');
        }
        return sb.toString();
    }

    private void validateBracket(String conditionStr) {
        // 合法性校验
        int left = 0;
        int right = 0;

        for (int i = 0; i < conditionStr.length(); i++) {
            char c = conditionStr.charAt(i);
            if (c == '(') {
                left++;
            } else if (c == ')') {
                right++;
            }
            if (right > left) {
                throw new RuntimeException("括号未闭合"); // 右括号大于左括号，语法错误
            }
        }
        if (left != right) {
            throw new RuntimeException("括号未闭合");
        }
    }

    public static String toAndConditionsString(List<Condition> conditions) {
        if (conditions == null) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < conditions.size(); i++) {
            Condition cond = conditions.get(i);
            sb.append(cond.toString());
            if (i + 1 < conditions.size()) {
                sb.append("and").append(' ');
            } else {
                sb.append(' ');
            }
        }
        return sb.toString();
    }

    public Condition buildConditionField(String conditionField) {
        this.conditionField = conditionField;
        return this;
    }

    public Condition buildConditionKey(String conditionKey) {
        this.conditionKey = conditionKey;
        return this;
    }

    public Condition buildConditionValue(String conditionValue) {
        this.conditionValue = conditionValue;
        return this;
    }

    public Condition buildOrConditions(Condition... orConditions) {
        this.orConditions = new LinkedList<>();
        for (Condition cond : orConditions) {
            this.orConditions.add(cond);
        }
        return this;
    }

    public Condition buildAndConditions(Condition... andConditions) {
        this.andConditions = new LinkedList<>();
        for (Condition cond : andConditions) {
            this.andConditions.add(cond);
        }
        return this;
    }

    public Condition buildOrConditions(List<Condition> orConditions) {
        this.orConditions = orConditions;
        return this;
    }

    public Condition buildAndConditions(List<Condition> andConditions) {
        this.andConditions = andConditions;
        return this;
    }

    public String getConditionField() {
        return conditionField;
    }

    public String getConditionKey() {
        return conditionKey;
    }

    public String getConditionValue() {
        return conditionValue;
    }

    public List<Condition> getOrConditions() {
        return orConditions;
    }

    public List<Condition> getAndConditions() {
        return andConditions;
    }

    public void setConditionField(String conditionField) {
        this.conditionField = conditionField;
    }

    public void setConditionKey(String conditionKey) {
        this.conditionKey = conditionKey;
    }

    public void setConditionValue(String conditionValue) {
        this.conditionValue = conditionValue;
    }

    public void setOrConditions(List<Condition> orConditions) {
        this.orConditions = orConditions;
    }

    public void setAndConditions(List<Condition> andConditions) {
        this.andConditions = andConditions;
    }
}
